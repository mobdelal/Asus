import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from '../../footer/footer.component';
import { LanguageService } from '../../../../services/language/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mini-footer',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './mini-footer.component.html',
  styleUrl: './mini-footer.component.css'
})  
export class MiniFooterComponent implements OnInit, OnDestroy {

  lang: string = '';
  private langSubscription: Subscription | undefined;

  constructor(
    private _LanguageService: LanguageService,
    private translate: TranslateService
  ) {}

  changeLang() {
    this.lang = (this.lang === 'en') ? 'ar' : 'en';
    this._LanguageService.changeLanguage(this.lang);
    this.translate.use(this.lang);
  }

  ngOnInit(): void {
    this.langSubscription = this._LanguageService.getlanguage().subscribe({
      next: (lang) => {
        this.lang = lang;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}