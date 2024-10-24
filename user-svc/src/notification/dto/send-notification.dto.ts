export class sendNotificationDTO {
  title: string;
  body: string;
  data?: { [key: string]: string };
  deviceIds: string[];
}
