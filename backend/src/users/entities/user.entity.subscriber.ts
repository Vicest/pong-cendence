import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    UpdateEvent,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @EventSubscriber()
  export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(dataSource: DataSource) {
      dataSource.subscribers.push(this);
    }
  
    listenTo() {
      return User;
    }
  
    afterUpdate(event: UpdateEvent<User>) {
      console.log(`Entity: ${event.entity}\n Columns ${event.updatedColumns}\n Relations ${event.updatedRelations}`);
    }
  }