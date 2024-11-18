import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

   private language:BehaviorSubject<string>

  constructor() {

    this.language=new BehaviorSubject('en')
   }


   getlanguage():Observable<string>{

    return this.language.asObservable();
   }



   changeLanguage(newval:string){
    this.language.next(newval)
   }
}
