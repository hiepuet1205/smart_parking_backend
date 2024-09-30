// import { MailerService } from '@nestjs-modules/mailer';
// import { Processor, WorkerHost } from '@nestjs/bullmq';
// import { Mail } from '@shared/interfaces/mail.interface';
// import { Job } from 'bullmq';

// @Processor('send:mail')
// export class MailProcessor extends WorkerHost {
//   constructor(private readonly mailService: MailerService) {
//     super();
//   }

//   async process(job: Job<Mail>): Promise<any> {
//     const { data } = job;

//     switch (job.name) {
//       case 'active-account':
//         await this.mailService.sendMail(data.data);
//         break;
//       default:
//         throw new Error('No job name match');
//     }
//   }
// }
