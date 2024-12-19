export interface DatabaseListener {
  initDBListeners(): Promise<void>;
}
