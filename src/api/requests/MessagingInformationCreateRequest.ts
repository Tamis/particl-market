import { IsNotEmpty } from 'class-validator';
import { RequestBody } from '../../core/api/RequestBody';

// tslint:disable:variable-name
export class MessagingInformationCreateRequest extends RequestBody {

    @IsNotEmpty()
    public protocol: string;

    @IsNotEmpty()
    public publicKey: string;

}
// tslint:enable:variable-name
