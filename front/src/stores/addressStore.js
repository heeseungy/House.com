import { defineStore } from "pinia";

export const useAddressStore = defineStore({
  id: "address",
  state: () => ({
    selectedAddressCode: {
      code1: "",
      code2: "",
      code3: "",
    },
    selectedAddressName: {
      name1: "",
      name2: "",
      name3: "",
    },
    recentAddressesCode: [],
    recentAddressesName: [],
  }),
  actions: {
    // set 주소값
    setAddressCode(code1, code2, code3) {
      console.log("pinia, setAddressCode : ", code1, code2, code3);
      this.selectedAddressCode = { code1, code2, code3 };
    },
    setAddressName(name1, name2, name3) {
      console.log("pinia, setAddressName : ", name1, name2, name3);
      this.selectedAddressName = { name1, name2, name3 };
    },
    // 배열에 주소값 추가
    addAddressCode(newAddress) {
      console.log("pinia, 주소코드배열 newAddress : ", newAddress);
      if (this.recentAddressesCode.length >= 5) {
        this.recentAddressesCode.shift(); // 가장 오래된 주소 제거
      }
      this.recentAddressesCode.push(newAddress); // 새 주소 추가
    },
    addAddressName(newAddress) {
      console.log("pinia, 주소이름배열 newAddress : ", newAddress);
      if (this.recentAddressesName.length >= 5) {
        this.recentAddressesName.shift(); // 가장 오래된 주소 제거
      }
      this.recentAddressesName.push(newAddress); // 새 주소 추가
    },
    // get 주소코드
    getAddressCode() {
      console.log("pinia, getAddressCode : ", this.selectedAddressCode);
      return this.selectedAddressCode;
    },
    // get 주소이름
    getAddressName() {
      console.log("pinia, getAddressName : ", this.selectAddressName);
      return this.selectedAddressName;
    },
    // get 주소 코드리스트 (전체)
    getAddressCodeList() {
      console.log("pinia, getAddressCodeList : ", this.recentAddressesCode);
      return this.recentAddressesCode;
    },
    // get 주소 이름리스트 (전체)
    getAddressNameList() {
      console.log("pinia, getAddressNameList : ", this.recentAddressesName);
      return this.recentAddressesName;
    },
    resetAddressState() {
      this.setAddressCode("", "", ""); // selectedAddressCode 초기화
      this.setAddressName("", "", ""); // selectedAddressName 초기화
      this.recentAddressesCode = []; // recentAddressesCode 초기화
      this.recentAddressesName = []; // recentAddressesName 초기화
    },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }],
  },
});
