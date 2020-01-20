import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RegistrationForm} from '../../domain/dto/registration-form';
import {Observable} from 'rxjs';
import {Message} from '../../domain/dto/message.dto';
import {environment} from '../../../environments/environment';

@Injectable()
export class RegistrationService {

  constructor(
    private http: HttpClient
  ) {}

  attemptRegistration(form: RegistrationForm): Observable<Message> {
    return this.http.post<Message>(environment.initialRegistration, form);
  }

  checkUsernameAvailability(username: string) {
    return this.http.get(environment.initialRegistration, { params: { username }, observe: 'response' });
  }
}
