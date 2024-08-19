import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnInit,
  OnDestroy,
  OnChanges,
  inject
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { epochDateTime, epochISOString } from 'idea-toolbox';

import { IDEACalendarPickerComponent } from './calendarPicker.component';

import { IDEATranslationsService } from '../translations/translations.service';

@Component({
  selector: 'idea-date-time',
  templateUrl: 'dateTime.component.html',
  styleUrls: ['dateTime.component.scss']
})
export class IDEADateTimeComponent implements OnInit, OnDestroy, OnChanges {
  private _modal = inject(ModalController);
  private _translate = inject(IDEATranslationsService);

  /**
   * The date to show/pick.
   */
  @Input() date: epochDateTime | epochISOString;
  /**
   * Whether to show the time picker (datetime) or not (date).
   */
  @Input() timePicker = false;
  /**
   * Whether to show the MANUAL time picker (datetime) or not (date).
   */
  @Input() manualTimePicker = false;
  /**
   * Whether to use the `epochISOString` format instead of `epochDateTime`.
   */
  @Input() useISOFormat = false;
  /**
   * The label for the field.
   */
  @Input() label: string;
  /**
   * The icon for the field.
   */
  @Input() icon: string;
  /**
   * The color of the icon.
   */
  @Input() iconColor: string;
  /**
   * Lines preferences for the item.
   */
  @Input() lines: string;
  /**
   * The color for the component.
   */
  @Input() color: string;
  /**
   * A placeholder for the field.
   */
  @Input() placeholder: string;
  /**
   * If true, the component is disabled.
   */
  @Input() disabled = false;
  /**
   * If true, the obligatory dot is shown.
   */
  @Input() obligatory = false;
  /**
   * If true, hidew the clear button in the header.
   */
  @Input() hideClearButton = false;
  /**
   * If set, is the minimum date selectable.
   */
  @Input() min: epochDateTime | epochISOString;
  /**
   * If set, is the maximum date selectable.
   */
  @Input() max: epochDateTime | epochISOString;

  @Output() dateChange = new EventEmitter<epochDateTime | epochISOString | null | any>();
  @Output() iconSelect = new EventEmitter<void>();

  valueToDisplay: string;
  private langChangeSubscription: Subscription;

  ngOnInit(): void {
    this.langChangeSubscription = this._translate.onLangChange.subscribe((): void => {
      this.valueToDisplay = this.getValueToDisplay(this.date);
    });
  }
  ngOnDestroy(): void {
    if (this.langChangeSubscription) this.langChangeSubscription.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.date || changes.timePicker) this.valueToDisplay = this.getValueToDisplay(this.date);
  }

  async openCalendarPicker(): Promise<void> {
    if (this.disabled) return;
    const modal = await this._modal.create({
      component: IDEACalendarPickerComponent,
      componentProps: {
        inputDate: this.date,
        title: this.label,
        timePicker: this.timePicker,
        manualTimePicker: this.manualTimePicker,
        hideClearButton: this.hideClearButton,
        min: this.min,
        max: this.max
      }
    });
    modal.onDidDismiss().then(({ data }): void => {
      if (data !== undefined && data !== null) {
        if (data === '') this.doSelect(null);
        else this.doSelect(data as Date);
      }
    });
    modal.present();
  }

  private getValueToDisplay(date: epochDateTime | epochISOString): string {
    return !date
      ? ''
      : this._translate.formatDate(date, this.timePicker || this.manualTimePicker ? 'd MMM yyyy, HH:mm' : 'mediumDate');
  }

  doSelect(date: Date): void {
    this.dateChange.emit(date ? (this.useISOFormat ? date.toISOString() : date.valueOf()) : null);
  }
  doIconSelect(event: Event): void {
    if (event) event.stopPropagation();
    this.iconSelect.emit();
  }
}
