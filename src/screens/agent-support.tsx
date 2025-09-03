import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Alert,
  Button,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Tts from 'react-native-tts';
import Voice, {
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechResultsEvent,
  SpeechRecognizedEvent,
  //   SpeechPartialResultsEvent,
} from '@react-native-voice/voice';

type Decision = 'YES' | 'NO' | 'UNKNOWN';

const API_BASE = 'https://api.rasguard.com'; // .env in real app
const LOCALE = 'en-US'; // or 'id-ID' if your users are Indonesian; can detect via device locale.

async function postDecision(transcript: string, decision: Decision) {
  try {
    await fetch(`${API_BASE}/danger-check/voice-decision`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        sessionId: Date.now().toString(),
        transcript,
        decision,
        channel: 'mobile-app',
      }),
    });
  } catch (e) {
    console.error('postDecision error', e);
  }
}

function toDecision(text: string): Decision {
  const v = text.trim().toLowerCase();
  const yesWords = [
    'yes',
    'ya',
    'iya',
    'betul',
    'danger',
    'bahaya',
    'tolong',
    'help',
    'help me',
    'please help',
    'i am in danger',
    'dangerous',
  ];
  const noWords = [
    'no',
    'tidak',
    'nggak',
    'ga',
    'aman',
    'ok',
    'okay',
    'fine',
    'safe',
    'i am safe',
    'not in danger',
  ];
  if (yesWords.some(w => v.includes(w))) return 'YES';
  if (noWords.some(w => v.includes(w))) return 'NO';
  // Basic heuristics; extend with backend NLP later
  if (v === 'ya' || v === 'iya' || v === 'yes.') return 'YES';
  if (v === 'tidak' || v === 'nggak' || v === 'no.') return 'NO';
  return 'UNKNOWN';
}

export default function SupportAgent() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [phase, setPhase] = useState<
    'PROMPTING' | 'LISTENING' | 'DECIDING' | 'DONE' | 'FALLBACK'
  >('PROMPTING');
  const repromptedRef = useRef(false);
  const timeoutRef = useRef<any>(null);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
    } catch {}
    try {
      await Voice.destroy();
    } catch {}
    setListening(false);
  }, []);

  const startListening = useCallback(async () => {
    setTranscript('');
    setListening(true);
    setPhase('LISTENING');
    try {
      await Voice.start(LOCALE, {
        EXTRA_PARTIAL_RESULTS: true,
        EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 1000,
        EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 800,
      } as any);
    } catch (e) {
      console.error('Voice.start error', e);
      setPhase('FALLBACK');
    }
    // Safety timeout (8s)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      if (listening) {
        await stopListening();
        decideAndSend();
      }
    }, 8000);
  }, [listening, stopListening]);

  const speakPrompt = useCallback(async () => {
    // Configure TTS
    try {
      if (Platform.OS === 'ios') {
        await Tts.setDefaultLanguage(LOCALE);
      } else {
        // Android often needs explicit voice id language set; skip for baseline
        await Tts.setDefaultLanguage(LOCALE);
      }
      await Tts.setDefaultRate(0.45);
      await Tts.setDefaultPitch(1.0);
    } catch (e) {}

    return new Promise<void>(resolve => {
      const onFinish = () => {
        Tts.removeEventListener('tts-finish', onFinish);
        resolve();
      };
      Tts.addEventListener('tts-finish', onFinish);
      Tts.speak('Are you in immediate danger? Say "Yes" or "No".');
    });
  }, []);

  const decideAndSend = useCallback(async () => {
    setPhase('DECIDING');
    const d = toDecision(transcript);
    await postDecision(transcript, d);

    if (d === 'UNKNOWN' && !repromptedRef.current) {
      repromptedRef.current = true;
      // Reprompt once
      await speakPrompt();
      startListening();
      return;
    }

    setPhase('DONE');
    if (d === 'YES') {
      Alert.alert('Received', 'We’re dispatching help now.');
    } else if (d === 'NO') {
      Alert.alert('Okay', 'We’ll keep monitoring and guide you.');
    } else {
      setPhase('FALLBACK');
    }
  }, [speakPrompt, startListening, transcript]);

  // Voice event handlers
  useEffect(() => {
    Voice.onSpeechStart = (_e: SpeechStartEvent) => {};
    Voice.onSpeechEnd = (_e: SpeechEndEvent) => {};
    Voice.onSpeechRecognized = (_e: SpeechRecognizedEvent) => {};
    Voice.onSpeechError = async (e: SpeechErrorEvent) => {
      console.warn('ASR error', e.error);
      await stopListening();
      decideAndSend();
    };
    Voice.onSpeechPartialResults = (e: any) => {
      const best = e.value?.[0] ?? '';
      setTranscript(best);
    };
    Voice.onSpeechResults = async (e: SpeechResultsEvent) => {
      const best = e.value?.[0] ?? '';
      setTranscript(best);
      await stopListening();
      decideAndSend();
    };
    return () => {
      Voice.destroy().catch(() => {});
      Voice.removeAllListeners();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [decideAndSend, stopListening]);

  // Boot flow: prompt → listen (no user action)
  useEffect(() => {
    (async () => {
      try {
        // Ask for permissions early (Android)
        if (Platform.OS === 'android') {
          // @react-native-voice/voice handles RECORD_AUDIO runtime request on start() in most cases,
          // but explicitly requesting via your existing permission util is safer.
          // If you already have a PermissionUtils, call it here before TTS.
        }
        await speakPrompt();
        await startListening();
      } catch (e) {
        console.error('boot flow error', e);
        setPhase('FALLBACK');
      }
    })();
  }, [speakPrompt, startListening]);

  const manualChoice = async (choice: 'YES' | 'NO') => {
    setTranscript(choice);
    await postDecision(choice, choice);
    setPhase('DONE');
  };

  const busy =
    phase === 'PROMPTING' || phase === 'LISTENING' || phase === 'DECIDING';

  return (
    <View style={{flex: 1, padding: 24, justifyContent: 'center', gap: 16}}>
      <Text style={{fontSize: 22, fontWeight: '600'}}>Listening…</Text>
      <Text style={{opacity: 0.7, minHeight: 40}}>
        {transcript || (busy ? 'Please speak now.' : '')}
      </Text>

      {busy && <ActivityIndicator />}

      {(phase === 'FALLBACK' || phase === 'DONE') && (
        <View style={{gap: 8, marginTop: 12}}>
          <Button
            title="YES — Help me now"
            onPress={() => manualChoice('YES')}
          />
          <Button
            title="NO — I need guidance"
            onPress={() => manualChoice('NO')}
          />
        </View>
      )}
    </View>
  );
}
