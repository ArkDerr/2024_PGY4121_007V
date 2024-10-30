import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserModel } from 'src/app/models/usuario';
import { FirebaseService } from 'src/app/service/firebase.service';
import { StorageService } from 'src/app/service/storage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email="bp@ventana.cl";
  password="123456";
  tokenID:any="";
  usuario:UserModel[] = [];

  constructor(private firebase:FirebaseService, private router:Router, private alertcontroller:AlertController, private storage:StorageService) { }

  ngOnInit() {
  }

  async login(){
    try {
      let usuario=await this.firebase.auth(this.email,this.password);
      this.tokenID=await usuario.user?.getIdToken();
      console.log(usuario);
      console.log("TokenID",await usuario.user?.getIdToken());
      const navigationExtras:NavigationExtras = {
        queryParams: {email: this.email}
      };
      this.pruebaStorage();
      this.router.navigate(['/principal'], navigationExtras);
    } catch (error) {
      console.log(error);
      this.popAlert();
    }
  }

  async popAlert(){
    const alert=await this.alertcontroller.create({
      header:'Error',
      message:"Usuario o contraseña incorrecta",
      buttons:['OK']
    })
    await alert.present();
  }

  async pruebaStorage(){
    const jsonToken:any=[
      {
        "token":this.tokenID,
      }
    ];
    this.storage.agregarStorage(jsonToken);
    console.log(await this.storage.obtenerStorage());
  }

}