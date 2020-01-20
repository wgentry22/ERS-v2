import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoginFormDto} from '../../domain/dto/login-form.dto';
import {Observable, of} from 'rxjs';
import {UserInfoState} from '../state/user.reducer';
import {CookieService} from 'ngx-cookie-service';
import {Message} from '../../domain/dto/message.dto';
import {flatMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

interface AccessToken {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) { }

  attemptAuthentication(form: LoginFormDto): Observable<UserInfoState | Message> {
    return this.http.post<any>(environment.login, form, { observe: 'response' }).pipe(
      flatMap(response => {
        if (response.ok) {
          const token: AccessToken = response.body;
          const dateNow = new Date();
          dateNow.setDate(dateNow.getDate() + 15); // 15 days
          this.cookieService.set('api_token', token.token, dateNow, 'app');
          return this.http.get<UserInfoState>(environment.api.userInfo);
        } else {
          return of(response.body.message);
        }
      })
    );
  }

  fetchUserInfoState(): Observable<UserInfoState | Message> {
    return this.http.get<UserInfoState>(environment.api.userInfo, { observe: 'response' }).pipe(
      flatMap(response => {
        if (response.ok) {
          const userInfo: UserInfoState = response.body;
          return of(userInfo);
        } else {
          return of({ message: 'You must sign in to continue' });
        }
      })
    );
  }


}
