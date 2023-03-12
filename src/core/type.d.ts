export interface ObjectError {
  isErr: true;
  status?: boolean;
  errMsg?: string;
  errCode?: string | number;
  errRoutine?: string;
  err?: any;
}
