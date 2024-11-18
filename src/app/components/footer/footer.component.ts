import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/language/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MiniFooterComponent } from "../mini-footer/mini-footer/mini-footer.component";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FooterComponent, TranslateModule, MiniFooterComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})



export class FooterComponent implements OnInit {
  lang:string ='';

  
  constructor(
    private _LanguageService:LanguageService ,private translate: TranslateService){

  }


  // changeLang() {
  //   this.lang = (this.lang == 'en') ? 'ar' : 'en';
  //   this._LanguageService.changeLanguage(this.lang);
  //   this.translate.use(this.lang);
  // }


  ngOnInit(): void {
    this._LanguageService.getlanguage().subscribe({
      next:(lang)=>{
        this.lang=lang;
      }
    })

  }
  
}
