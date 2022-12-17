import { Component } from "preact";
import { DIRECTUS_HOST } from "../utils/directus/constant.ts";
import { getCurrentUserInfo, UserInfo } from "../utils/directus/users.ts";
import { LoginResult, updateStorage } from "../utils/directus/auth.ts";

export default class LoginSuccess extends Component<LoginResult, UserInfo> {
  constructor(props: LoginResult) {
    super(props);
    this.state = { first_name: "Kate", last_name: "Allise", avatar: "" };
  }

  async componentDidMount() {
    updateStorage(this.props);

    const userInfo = await getCurrentUserInfo();
    this.setState(userInfo);

    // setTimeout(() => {
    //   window.location.replace("/");
    // }, 2000);
  }

  private getAvatar(): string {
    if (!this.state.avatar) {
      return "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp";
    } else {
      return DIRECTUS_HOST + "/assets/" + this.state.avatar + "?access_token=" +
        this.props.access_token;
    }
  }

  render() {
    return (
      <>
        <p class="text-xl italic mx-auto text-gray-700 max-w-4xl">
          Welcome back!
        </p>
        <div class="mt-12 mb-6 flex justify-center">
          <img
            src={this.getAvatar()}
            class="rounded-full w-24 h-24 shadow-lg"
            alt="smaple image"
          />
        </div>
        <p class="text-gray-500">
          {this.state.first_name}{" "}
          {this.state.last_name}, you will be redirected to home in 2 seconds...
        </p>
      </>
    );
  }
}
