export interface Job {
  name: string;
  schedule: string;
  onStart?: () => Promise<void> | void;
  onExit?: () => Promise<void> | void;
  run: () => Promise<void> | void;
}
