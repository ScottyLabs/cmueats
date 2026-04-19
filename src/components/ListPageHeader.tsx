import { useMemo } from "react";
import { $api, login, logout } from "../api";
import css from "./ListPageHeader.module.css";
import { getGreetings } from "../util/greeting";
import GoogleIcon from "../assets/google.svg?react";
import SignOut from "../assets/control_buttons/signOut.svg?react";
import { useThemeContext } from "../ThemeProvider";
import mikuHeaderImg from "../assets/miku/miku-banner-2026.png";

function AprilFools() {
    return (
        <span>
            <span style={{ color: "var(--logo-first-half)" }}>cmu</span>
            <span style={{ color: "var(--logo-second-half)" }}>:eats </span>
            has been acquired by
            <span style={{ color: "var(--yellow-300)" }}> El Gallo De Oro</span>
            <br />
            <span style={{ fontSize: 24, color: "var(--black-500)" }}>
                and thus will also be{" "}
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a
                    href="https://the-tartan.org/2026/02/16/el-gallo-to-close-after-29-years-of-operation/"
                    className={css["april-fools-url"]}
                    target="_blank"
                    rel="noreferrer"
                >
                    closing in 34 days
                </a>
            </span>
        </span>
    );
}

export default function ListPageHeader() {
    const {
        data: userLoggedInData,
        isLoading,
        error,
    } = $api.useQuery("get", "/whoami");
    const { theme } = useThemeContext();
    const { mobileGreeting, desktopGreeting } = useMemo(
        () =>
            getGreetings(new Date().getHours(), {
                isMikuDay: theme === "miku",
            }),
        [theme],
    );
    if (theme === "miku") {
        return (
            <img
                className={css["list-header-miku"]}
                src={mikuHeaderImg}
                alt=""
            />
        );
    }

    return (
        <header className={css["list-header"]}>
            <h3 className={css["list-header__greeting"]}>
                {theme === "april-fools" ? (
                    <AprilFools />
                ) : (
                    <span
                        role="button"
                        className={css["list-header__greeting-button"]}
                        onClick={() =>
                            document
                                .getElementById("footer")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        <span className={css["list-header__greeting--desktop"]}>
                            {userLoggedInData?.user?.firstName &&
                                `Hi ${userLoggedInData?.user?.firstName}! `}
                            {desktopGreeting}
                        </span>

                        <span className={css["list-header__greeting--mobile"]}>
                            {userLoggedInData?.user?.firstName &&
                                `Hi ${userLoggedInData?.user?.firstName}! `}
                            {mobileGreeting}
                        </span>
                    </span>
                )}
            </h3>
            {error !== null ? (
                <button disabled type="button" className={css.button__error}>
                    Failed to fetch login info!
                </button>
            ) : isLoading ? (
                <button disabled type="button">
                    Loading login status...
                </button>
            ) : userLoggedInData !== undefined &&
              userLoggedInData.user !== null ? (
                <button onClick={logout} type="button">
                    <SignOut />
                    Sign out ({userLoggedInData.user.email})
                </button>
            ) : (
                <button onClick={login} type="button">
                    <GoogleIcon />
                    Sign in with your CMU email
                </button>
            )}
        </header>
    );
}
