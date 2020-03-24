import { Component, Input } from '@angular/core';
import IdeaX = require('idea-toolbox');

import { IDEATranslationsService } from '../translations/translations.service';

@Component({
  selector: 'idea-address',
  templateUrl: 'address.component.html',
  styleUrls: ['address.component.scss']
})
export class IDEAAddressComponent {
  /**
   * The address to manage.
   */
  @Input() public address: IdeaX.Address;
  /**
   * If true, show the field `contact`.
   */
  @Input() public showContact: boolean;
  /**
   * If true, show the field `address2`.
   */
  @Input() public showAddress2: boolean;
  /**
   * If true, show the field `phone`.
   */
  @Input() public showPhone: boolean;
  /**
   * If true, show the field `email`.
   */
  @Input() public showEmail: boolean;
  /**
   * Whether the fields are editable or disabled.
   */
  @Input() public editMode: boolean;
  /**
   * The lines attribute of the item.
   */
  @Input() public lines: string;
  /**
   * If true, show obligatory dots.
   */
  @Input() public obligatory: boolean;

  /**
   * The suggestions for the Countries picker.
   */
  public countriesSuggestions: Array<IdeaX.Suggestion>;
  /**
   * Shortcut to Countries enum.
   */
  public Countries = IdeaX.Countries;
  /**
   * To toggle the detailed view.
   */
  public addressCollapsed: boolean;

  constructor(public t: IDEATranslationsService) {
    this.address = new IdeaX.Address();
    this.showContact = false;
    this.showAddress2 = false;
    this.showPhone = false;
    this.showEmail = false;
    this.editMode = true;
    this.lines = 'inset';
    this.countriesSuggestions = Object.keys(IdeaX.Countries).map(
      k => new IdeaX.Suggestion({ value: IdeaX.Countries[k], name: k })
    );
    this.addressCollapsed = true;
  }

  /**
   * Toggle the detailed/collapsed view.
   */
  public toggleCollapse() {
    this.addressCollapsed = !this.addressCollapsed;
  }
}
