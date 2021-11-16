import styles from "./contact.module.css";

export default function Contact(){

    return(
        <section className={styles.section}>
            <div className={styles.content}>
                <div className={styles.title}>
                    <h1>Contact</h1>
                </div>
                <div className={styles.formContainer}>
                    <form>
                        <div className={styles.name + " " + styles.input}>
                            <label htmlFor="name">Name*</label>
                            <input type="text"  id="name" name="name" required/>
                        </div>
                        <div className={styles.email + " " + styles.input}>
                            <label htmlFor="email">Email*</label>
                            <input type="email"  id="email" name="email" required/>
                        </div>
                        <div className={styles.phone + " " + styles.input}>
                            <label htmlFor="phone">Phone</label>
                            <input type="tel"  id="phone" name="phone" />
                        </div>
                        <div className={styles.message + " " + styles.input}>
                            <label htmlFor="message">Message*</label>
                            <textarea id="message" name="message" required/>
                        </div>
                        <p>*Required</p>
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </section>
    )
}