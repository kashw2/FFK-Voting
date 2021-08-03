import {Component, OnInit} from '@angular/core';
import {Option} from "funfix-core";
import {ActivatedRoute} from "@angular/router";
import {FfkApiService} from "../../service/ffk-api.service";
import {filter, from, map, tap} from "rxjs";
import {CrudService} from "../../service/crud.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private ffkApiService: FfkApiService,
    private crudService: CrudService,
    ) { }

  getDiscordAuthCode(): Option<string> {
    return Option.of(this.activatedRoute.snapshot.queryParamMap.get('code'));
  }

  ngOnInit(): void {
    if (this.getDiscordAuthCode().nonEmpty()) {
      from(this.ffkApiService.writeUser(this.getDiscordAuthCode().get()))
        .pipe(map(v => v.toOption().flatMap(u => u.getDiscordId())))
        .pipe(filter(v => v.nonEmpty()))
        .pipe(map(v => v.get()))
        .pipe(tap(did => this.crudService.crudLocalStorageService.create('discordid', did)))
        .subscribe();
    }
  }

}
