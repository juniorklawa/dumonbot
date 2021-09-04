export interface IStepper {
  execute(): Promise<void>;
}
