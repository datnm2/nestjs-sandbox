export class QueueHelper {
  public static getQueueName(name: string) {
    return process.env.NODE_ENV + ':' + name;
  }
}
