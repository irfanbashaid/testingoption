import { Component, OnInit,OnDestroy } from '@angular/core';
import { BinaryService } from "../service/binary.service";
import { UserService } from "../shared/user.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit ,OnDestroy {
  // public binary;
  public etherumAccountAddress='';
  public userDetails;
  public userService;
  public id;
  
  constructor(private http:HttpClient,private route:Router,private binary:BinaryService) { 
    var ins =this;
    ins.userService = new UserService(http)
  //  ins.binary = new BinaryService()
  //  ins.fetch_ethereum_balance();
   ins.fetch_contract_balance();
  }

  adminnav(){
    (document.getElementById('dept')as HTMLInputElement).hidden=true;
    (document.getElementById('albt')as HTMLInputElement).hidden=true;
    (document.getElementById('mb')as HTMLInputElement).hidden=true;
    (document.getElementById('cown')as HTMLInputElement).hidden=false;
    (document.getElementById('cb')as HTMLInputElement).hidden=false;
    (document.getElementById('sr')as HTMLInputElement).hidden=false;
   }
   usernav(){
    (document.getElementById('dept')as HTMLInputElement).hidden=false;
    (document.getElementById('albt')as HTMLInputElement).hidden=false;
    (document.getElementById('mb')as HTMLInputElement).hidden=false;
    (document.getElementById('cown')as HTMLInputElement).hidden=true;
    (document.getElementById('cb')as HTMLInputElement).hidden=true;
    (document.getElementById('sr')as HTMLInputElement).hidden=true;
   }
   

  fetch_ethereum_balance(){
    // let biny = new BinaryService()
    this.binary.getEtherumAccountBalance().then(res=>
    {
      (document.getElementById('address_acc_balance') as HTMLInputElement).innerText = res.toString();
    })
  }

  fetch_address(){
    this.etherumAccountAddress=this.binary._etherumAccountAddress;
  }

  fetch_contract_balance(){
    this.binary.balanceOf().then(balance=>{
      (document.getElementById('address_balance') as HTMLInputElement).innerText = balance.toString();
    })
  }
  onLogout(){
    this.userService.deleteToken();
    this.route.navigate(['/login']);
  }

  get_name()
  {
    let meta=this;
    meta.userService.getUserProfile().subscribe(
      res => {
        meta.userDetails = res['user'];
       let username = res['user']['fullName']
        console.log( res['user'] );
        (document.getElementById('username') as HTMLInputElement).innerText=username
        // alert( meta.username )
      },
      err => { 
        console.log(err);
        
      }
    );
  }

// check_privatekey()
// {
//   var meta = this;
//   meta.id = setInterval(function(){
//     // alert(meta.binary._etherumAccountAddress)
//     console.log('Set Interval=>'+meta.binary._etherumAccountAddress);
    
//     if(meta.binary._etherumAccountAddress == null)
//     {
//       meta.userService.deleteToken();
//       meta.route.navigate(['login']);
//     }
//     else
//     {
   
//     }
//   },1); 
// }

  ngOnInit() {
    var meta = this;
    meta.get_name()
   
   
  }
  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }


}
