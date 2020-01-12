import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";

@Injectable()
export class ErsRequestInterceptor implements HttpInterceptor {

  private headers: HttpHeaders = new HttpHeaders({
    "Access-Control-Allow-Headers": "DNT, X-CustomHeader, Keep-Alive, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Credential, Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin": environment.corsUrl,
    "Accept": "application/json",
    "Content-Type": "application/json"
  });

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone({
      withCredentials: true,
      headers: this.headers,
      reportProgress: true
    });

    return next.handle(request);
  }

}
