import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";


@Injectable({ providedIn: "root" })
export class BotherService {

    constructor(private http: HttpClient) {}

    runBother(bounds) {
        this.http.get(environment.backend + "/bother/?bounds=" + bounds).subscribe((data: string[]) => console.log(data));
    }
}