import { Component, OnInit } from 'angular2/core';
import { Observable } from 'rxjs/Observable';
import { STOMPService, STOMPState, StateLookup } from '../services/stomp.service';

/**
 * STOMP connection status as a component
 */
@Component({
	selector: 'stomp-status',
	template: `
		<div class="col-xs-2 pull-right">
			<p> <span id="status"> {{state|async}} </span> </p>
		</div>
	`
})
export class STOMPStatusComponent implements OnInit {

	private state: Observable<string>;

	constructor(private _stompService: STOMPService) { }

	ngOnInit()
	{
		console.log("Status init");
		this.state = this._stompService.state
			.map( (state:number) => StateLookup[state] );
	}
}
