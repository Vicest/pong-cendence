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
  
    beforeUpdate(event: UpdateEvent<User>) {

      (event.updatedColumns.includes('password') || event.updatedColumns.includes('email')) return;
      
    }
  }