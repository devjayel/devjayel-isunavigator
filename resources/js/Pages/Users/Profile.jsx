import UsersLayout from "@/Layouts/UsersLayout";
import General from "./Partials/General";
import Email from "./Partials/Email";
import Password from "./Partials/Password";
import Avatar from "./Partials/Avatar";
import Account from "./Partials/Account";

export default function Dashboard({auth,storage}) {
    return (
        <UsersLayout title="Profile" user={auth.user}>
            <div className="space-y-6 max-w-screen-lg  mx-auto">
                <General user={auth.user} />
                <Avatar user={auth.user} storage={storage} />
                <Email email={auth.user.email} />
                <Password />
                <Account user={auth.user} />
            </div>
        </UsersLayout>
    );
}