import { IssueStatus } from '../../types';

export interface StatusType {
  name: string;
  color?: string | undefined;
  type?: IssueStatus;
}

export interface NotionIssueImportType {
  title: string;
  priority: number;
  labels: Array<string>;
  status: string;
  assigneeId: string;
  description: string;
}
