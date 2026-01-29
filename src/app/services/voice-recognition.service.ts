import { EventEmitter, Injectable, NgZone } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  recognition: any;
  text: string = '';
  isListening: boolean = false;
  isStarting: boolean = false;

  textEmitter = new EventEmitter<string>();

  constructor(private ngZone: NgZone) {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      this.isStarting = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.isStarting = false;
    };

    this.recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      this.text = transcript.charAt(0).toUpperCase() + transcript.slice(1);
      this.ngZone.run(() => {
        this.textEmitter.emit(this.text);
      });
    };


    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  start() {
    if (this.isListening || this.isStarting) {
      console.log('Already starting/listening, ignoring start()');
      return;
    }
    try {
      this.isStarting = true;
      this.recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      this.isStarting = false;
    }
  }

  stop() {
    if (this.isListening) {
      this.recognition.stop();
    }
  }

  setLanguage(languageCode: string) {
    this.recognition.lang = languageCode;
    console.log('Speech recognition language set to', languageCode);
  }
}

