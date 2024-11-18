import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { MainLayoutComponent } from "./components/main-layout/main-layout.component";
import { ProductComponent } from './components/product/product.component';
import { LanguageService } from '../services/language/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MainDivComponent } from "./components/main-div/main-div/main-div.component";
import { LoginComponent } from "./components/login/login/login.component";
import { ProductCardComponent } from "./components/product-card/product-card.component";
import { ImageGridComponent } from "./components/image-grid/image-grid.component";
import { CampaignsComponent } from "./components/campaigns/campaigns.component";
import { FilterdProductComponent } from "./components/filterd-product/filterd-product.component";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { ProductDetailsComponent } from "./components/product-details/product-details.component";
import { CheckoutComponent } from "./components/checkout/checkout/checkout.component";
import { PaypalComponent } from "./components/paypal/paypal.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, TranslateModule,
     MainLayoutComponent, ProductComponent, FooterComponent, 
     MainDivComponent, LoginComponent, ProductCardComponent, 
     ImageGridComponent, CampaignsComponent, FilterdProductComponent, 
     SignUpComponent, ProductDetailsComponent, CheckoutComponent,
      PaypalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'asus';

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
