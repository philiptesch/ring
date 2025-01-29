import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collectionData, collection, doc, addDoc } from '@angular/fire/firestore';
import { Game } from '../models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {


  constructor(private router: Router, private firestore: Firestore ) {

  }

  ngOnInit(): void {

  }

  newGame() {
    let game = new Game();

    addDoc(collection(this.firestore, 'games'), game.toJson() ).then((gameInfo:any) => {
      console.log(gameInfo.id, game);
      this.router.navigateByUrl('/game/' + gameInfo.id)
    });


  }
}
