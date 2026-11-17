import { Service, signal } from '@angular/core';
import type { Message } from '../models/message';

@Service()
export class MessageService {
  private _messages = signal<Message[]>([]);
  messages = this._messages.asReadonly();

  add(message: Message) {
    this._messages.update(messages => [...messages, message]);
  }

  delete(index: number) {
    this._messages.update(messages => messages.filter((_, i) => i !== index)); // [0, 1, 2] => [0, 2] if index = 1
  }
}
