import { User } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetSignInUserResponseDTO extends ResponseDto, User{
    
}