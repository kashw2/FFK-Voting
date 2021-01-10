import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {VotingPanelPageComponent} from './pages/voting-panel-page/voting-panel-page.component';
import {ProfilePageComponent} from './pages/profile-page/profile-page.component';
import {VotePageComponent} from './pages/vote-page/vote-page.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: HomePageComponent
	},
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'voting-panel',
    component: VotingPanelPageComponent,
  },
  {
    path: 'profile/:id',
    component: ProfilePageComponent,
  },
  {
    path: 'vote/:id',
    component: VotePageComponent,
  },
	{
		path: '**',
		component: HomePageComponent,
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
