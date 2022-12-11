import { Component } from "preact";
import { DIRECTUS_HOST } from "../utils/directus/constant.ts";
import { getUserInfo, UserInfo } from "../utils/directus/getUserInfo.ts";
import { LoginResult } from "../utils/directus/login.ts";

export default class LoginSuccess extends Component<LoginResult, UserInfo> {
  constructor() {
    super();
    this.state = { first_name: "Kate", last_name: "Allise", avatar: "" };
  }

  async componentDidMount() {
    localStorage.setItem("access_token", this.props.access_token);
    localStorage.setItem("access_token.expires", this.props.expires.toString());
    localStorage.setItem("refresh_token", this.props.refresh_token);

    const userInfo = await getUserInfo({
      access_token: this.props.access_token,
    });
    this.setState(userInfo);

    setTimeout(() => {
      window.location.replace("/");
    }, 2000);
  }

  avatar(): string {
    if (!this.state.avatar) {
      return "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp";
    } else {
      return DIRECTUS_HOST + "/assets/" + this.state.avatar + "?access_token=" +
        this.props.access_token;
    }
  }

  render(props: LoginResult) {
    return (
      <>
        <p class="text-xl italic mx-auto text-gray-700 max-w-4xl">
          Welcome back!
        </p>
        <div class="mt-12 mb-6 flex justify-center">
          <img
            src={this.avatar()}
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
