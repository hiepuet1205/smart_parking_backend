import { AccountType } from '@payment/enums/account-type.enum';

export class AddPaymentDto {
  bankCode: string;

  accountNo: string;

  accountName: string;

  accountType: AccountType;
}
