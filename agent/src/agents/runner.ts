import { Runner, InMemoryMemoryService, InMemorySessionService, isFinalResponse } from '@google/adk';

class AgentRunner {
  private runner: Runner;
  private appName: string;
  private userId: string = 'system_user';

  constructor(agent: any, appName: string = 'fleet_green_app') {
    this.appName = appName;
    this.runner = new Runner({
      agent,
      appName: this.appName,
      sessionService: new InMemorySessionService(),
      memoryService: new InMemoryMemoryService(),
    });
  }

  async runAgent(input: any, sessionId: string = 'default_session'): Promise<string> {
    try {
      await this.runner.sessionService
        .createSession({
          appName: this.appName,
          sessionId: sessionId,
          userId: this.userId,
        })
        .catch(() => {}); // Ignorar si ya existe

      const txt = JSON.stringify(input);
      let response = '';

      for await (const event of this.runner.runAsync({
        userId: this.userId,
        sessionId: sessionId,
        newMessage: { role: 'user', parts: [{ text: txt }] },
      })) {
        if (isFinalResponse(event)) {
          response = event.content.parts[0].text;
        }
      }
      return response;
    } catch (err) {
      console.error('Error running agent:', err);
      throw err;
    }
  }
}

export default AgentRunner;
