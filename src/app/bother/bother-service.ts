import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";


@Injectable({ providedIn: "root" })
export class BotherService {

    constructor(private http: HttpClient) {}

    runBother() {
        this.http.get(environment.backend + "/bother").subscribe((data: string[]) => console.log(data));
    }
}