import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BotherService {
  botherSubject = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) {}

  runBother(bounds) {
    this.http
      .get(environment.backend + '/bother/?bounds=' + bounds)
      .subscribe((data: string[]) => {
        //console.log(data);
        this.botherSubject.next(data);
        return data;
      });
  }
}
