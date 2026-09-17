import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';

@ApiTags('AI Physiotherapy Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  @ApiOperation({ summary: 'Send message to PhysioEdvance AI assistant' })
  async sendMessage(@Body() body: { message: string }) {
    return this.chatbotService.processMessage(body.message || '');
  }
}
