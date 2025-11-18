package com.codeandskills.common.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;

public class DotenvInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {

        String[] activeProfilesTab = applicationContext.getEnvironment().getActiveProfiles();
        String[] defaultProfiles = applicationContext.getEnvironment().getDefaultProfiles();

        System.out.println("===== > Active profiles: " + String.join(",", activeProfilesTab));
        System.out.println("===== > Default profiles: " + String.join(",", defaultProfiles));

        // Profil "effectif" : si aucun actif → on prend les défauts ("default")
        String profile = (activeProfilesTab.length > 0)
                ? String.join(",", activeProfilesTab)
                : String.join(",", defaultProfiles);

        String dotenvDir = System.getProperty("DOTENV_DIR", ".");

        System.out.println("===== > Loading environment variables from " + dotenvDir + " for profile: " + profile);

        // 👉 On ne charge Dotenv qu'en local/dev
        if (!profile.contains("local") && !profile.contains("dev")) {
            System.out.println("===== > Skipping dotenv loading (profile is not local/dev)");
            return;
        }

        Dotenv dotenv = Dotenv.configure()
                .directory(dotenvDir)
                .ignoreIfMissing()
                .load();

        dotenv.entries().forEach(e -> {
            if (System.getProperty(e.getKey()) == null && System.getenv(e.getKey()) == null) {
                System.setProperty(e.getKey(), e.getValue());
            }
        });
    }
}