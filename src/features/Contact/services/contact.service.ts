interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export class ContactService {
  constructor() {}

  async registerContact(contact: ContactData): Promise<ContactData> {
    // TODO: Implement API call to backend
    console.log("Contact registered:", contact);
    return contact;
  }
}

const contactService = new ContactService();

export default contactService;
