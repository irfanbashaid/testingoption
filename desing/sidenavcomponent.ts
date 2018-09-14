import { Component, OnInit } from '@angular/core';
import { BinaryService } from "../service/binary.service";
import { UserService } from "../shared/user.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import $ from 'jquery';


@Component({
 selector: 'app-sidenav',
 templateUrl: './sidenav.component.html',
 styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
 public binary;
 public etherumAccountAddress='';
 public userDetails;
 public userService;
 public username;
 constructor(private http:HttpClient,private route:Router) {
   var ins =this;
   ins.userService = new UserService(http)
  ins.binary = new BinaryService()
  ins.fetch_ethereum_balance();
  ins.fetch_contract_balance();
 }



 triggering(){
   $(document).ready(function(){
     $('#id2').click(function(){
       $('#mySidenav').hide();
     });
   });

 }

 fetch_ethereum_balance(){
 this.binary.getEtherumAccountBalance().then(res=>
   {
     (document.getElementById('address_acc_balance') as HTMLInputElement).innerText = res;
   })
 }

 fetch_address(){
   this.etherumAccountAddress=this.binary._etherumAccountAddress;
 }

 fetch_contract_balance(){
   this.binary.balanceOf().then(balance=>{
     (document.getElementById('address_balance') as HTMLInputElement).innerText = balance;
   })

 }
 onLogout(){
   this.userService.deleteToken();
   this.route.navigate(['/login']);
 }

 z:any=0;

 openNav() {

   // $(document).getElementById('mySidenav').style.display="none";

this.z++;

   if(this.z%2!=0){
     document.getElementById("mySidenav").style.width = "200px";
}
 else{
 document.getElementById("mySidenav").style.width = "120px";
 }

 }


 ngOnInit() {
   document.getElementById("mySidenav").style.width = "200px";

   var meta = this;
   meta.userService.getUserProfile().subscribe(
     res => {
       meta.userDetails = res['user'];
       meta.username = res['user']['fullName']
       console.log( res['user'] );
     },
     err => {
       console.log(err);

     }
   );
 }

}