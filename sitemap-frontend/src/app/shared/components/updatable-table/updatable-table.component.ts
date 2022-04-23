import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { DragulaService } from 'ng2-dragula';

interface TableConfig {
  property: string;
  options: { id: string; value: string }[];
}
@Component({
  selector: 'app-updatable-table',
  templateUrl: './updatable-table.component.html',
  styleUrls: ['./updatable-table.component.scss'],
})
export class UpdatableTableComponent implements OnInit {
  @Input('config') config: TableConfig;
  selected = [];
  dirty = false;
  options = [];
  stringify = JSON.stringify;
  name: string = `options${uuidv4()}`;
  @Output('onSave') onSave: EventEmitter<any> = new EventEmitter();
  constructor(private dragulaService: DragulaService) {
    if (!this.dragulaService.find(this.name)) {
      this.dragulaService.createGroup(this.name, {
        removeOnSpill: true,
        copy: false,
        revertOnSpill: true,
        copyItem: (item) => ({ ...item }),
      });
      this.dragulaService.drop(this.name).subscribe(() => {
        setTimeout(() => {
          document
            .querySelectorAll(`clr-dg-row.${this.name}`)
            .forEach((ele) => {
              console.log(ele);
            });
        }, 1000);
      });
    }
  }

  ngOnInit(): void {
    this.options = [...this.config.options];
  }

  onAdd() {
    this.config.options.push({ id: uuidv4(), value: '' });
    this.dirty = true;
  }

  onDelete() {
    this.config.options = this.config.options.filter(
      (item) => !this.selected.includes(item)
    );
    this.dirty = true;
  }

  save() {
    this.onSave.emit(this.config);
    this.dirty = false;
  }

  dragulaModelChange(evt) {}
}
