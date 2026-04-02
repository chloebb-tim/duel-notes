"use client";

const AuthForm = ({ titre, formAction, showName, ctaTitle, children, passwordMinLength, passwordHint }) => {
    return (
        <div>
            <form
                action={formAction}

            >
                <h2>
                    {titre}
                </h2>

                {showName && (
                    <div>
                        <label

                            htmlFor="fld_name"
                        >
                            Nom complet
                        </label>
                        <input
                            type="text"
                            id="fld_name"
                            name="name"
                            required
                            placeholder="Entrez votre nom"
                        />
                    </div>
                )}

                <div>
                    <label
                        htmlFor="fld_email"
                    >
                        Adresse courriel
                    </label>
                    <input
                        type="email"
                        id="fld_email"
                        name="email"
                        autoComplete="email"
                        required
                        placeholder="exemple@email.com"
                    />
                </div>

                <div>
                    <label
                        htmlFor="fld_password"
                    >
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        id="fld_password"
                        placeholder="********"
                        name="password"
                        minLength={passwordMinLength}
                        required
                    />
                    {passwordHint && <small>{passwordHint}</small>}
                </div>

                <button className="btn"
                    type="submit"
                >
                    {ctaTitle}
                </button>

                {children}
            </form>
        </div>
    );
};
export default AuthForm;