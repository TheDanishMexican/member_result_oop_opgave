"use strict";

export function constructMember(memberdata) {
  const MemberObject = {
    id: memberdata.id,
    name: memberdata.firstName,
    active: memberdata.isActiveMember,
    birthday: new Date(memberdata.dateOfBirth),
    age: undefined,
    juniorOrSenior: undefined,

    getAge() {
      const today = new Date();
      const age = today.getFullYear() - this.birthday.getFullYear();
      
      if (
        today.getMonth() < this.birthday.getMonth() ||
        (today.getMonth() === this.birthday.getMonth() && 
         today.getDate() < this.birthday.getDate())
      ) {
        return age - 1;
      } else {
        return age;
      }
    },

    isJunior() {
      const age = this.getAge();

      if (age < 18) {
        return true;
      } else {
        return false;
      }
    },

    isSenior() {
      const age = this.getAge();

      if (age >= 18) {
        return true;
      } else {
        return false;
      }
    },

    isJuniorOrSenior() {
      if (this.isJunior()) {
        return 'Junior'
      } else if (this.isSenior()) {
        return 'Senior'
      }
    },

    isActive() {
        const isActive = this.active;

        if (isActive === true) {
            return 'Aktiv'
        } else {
            return 'Inaktiv'
        }
    }

  };

  MemberObject.active = MemberObject.isActive();
  MemberObject.juniorOrSenior = MemberObject.isJuniorOrSenior();
  MemberObject.age = MemberObject.getAge()

  return MemberObject;
}