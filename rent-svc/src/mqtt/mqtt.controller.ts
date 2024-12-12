import { Body, Controller, Post } from '@nestjs/common';
import { MqttService } from './mqtt.service';

@Controller('mqtt')
export class MqttController {
  constructor(private readonly mqttService: MqttService) {}

  @Post()
  async mqtt(@Body() { slotId, status }) {
    const topic = `barrier-${slotId}`;
    await this.mqttService.publishMessage(
      topic,
      JSON.stringify({
        controlBarie: status,
      }),
    );
  }
}
