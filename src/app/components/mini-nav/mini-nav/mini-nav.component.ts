import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/language/language.service';
import { RouterLink ,Router} from '@angular/router';

@Component({
  selector: 'app-mini-nav',
  standalone: true,
  imports: [TranslateModule ,RouterLink],
  templateUrl: './mini-nav.component.html',
  styleUrl: './mini-nav.component.css'
})
export class MiniNavComponent {
  lang:string ='en';
  translate: any;

  constructor( private _LanguageService:LanguageService ,
  ){

  }


  changeLang() {
    this.lang = (this.lang == 'en') ? 'ar' : 'en';
    this._LanguageService.changeLanguage(this.lang);
    this.translate.use(this.lang);
  }


}
