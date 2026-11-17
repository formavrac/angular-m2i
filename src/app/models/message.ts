export interface Message {
  type: 'info' | 'error' | 'success';
  content: string;
}
