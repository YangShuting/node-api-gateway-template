import winston from 'winston';

/**
 * In un modulo posso dipendere da elementi definiti all'esterno quali:
 * - oggetti di config
 * - istanze
 *
 * Posso decidere di risolvere queste dipendenze usando DI e definendo dei builder che ricevono le configurazioni e
 * restituiscono le funzioni opportune. Può aver senso per oggetti di config di cui il modulo deve solo fare da
 * utilizzatore andando a creare una composizione di funzioni di cui la main app è la madre. Per esempio se recupero un
 * parametro applicativo definito in fase di startup del servizio, lo inietto con DI.
 *
 * Posso decidere di risolvere queste dipendenze facendo riferimento a classi master di feature come ad esempio Log, File, etc..
 * Si parte dal presupposto che ogni modulo dovrebbe usare lo stesso logger, lo stesso modulo per svolgere una determinata responsabilità. Allora
 * lascio al modulo il compito di fare require() o import del modulo di riferimento.
 *
 * La prima tecnica permette di poter modificare in un solo punto il cambiamento ottenendo a gratis la propagazione
 * verso i moduli utilizzati. Per esempio cambio l'oggetto/funzione logger nel modulo main e tramite una propagazione con DI che si basa su
 * un'interfaccia di logger comune per tutta l'app ottengo a gratis il cambiamento senza modificare codice.
 * La seconda tecnica invece, nell'esempio del logger, ammette che ogni modulo debba recuperare un'istanza di logger facendo riferimento allo stesso modulo.
 * Centralizzo nel logger builder la modifica del codice che serve per soddisfare il cambiamento verso un eventuale nuovo logger.
 *
 * Il problema è che potrei volere che ogni modulo sia singleton e che il builder restituisca un logger sulla base di una configurazione di startup, per
 * esempio il livello di log. Ogni modulo può puntare allo stessa bulder function ma questa voglio che sia soggetta a closure di un valore impostato
 * una sola volta e possibilmente allo startup applicativo. Quindi ci dovrebbe essere un punto (main app) dove viene iniettata la configurazione di startup, es il log level.
 * I singoli moduli invece dovrebbero invocare un builder senza dover conoscere il log level. Come fare?
 *
 * Il modulo Logger potrebbe:
 * - recuperare da solo il log level una volta sola senza che venga iniettato dalla main app
 * - ricevere il log level dalla main app per memorizzarlo e definire un logger builder che ne faccia riferimento
 *
 */

// stato del modulo relativo al livello di log
let level;
const DEFAULT_LEVEL = 'info';

const build = (logLevel) => {
    console.log('build logger: level = ' + level + ' logLevel = ' + logLevel);
    if (logLevel && !level) {
        level = logLevel;
        console.log('setted log level to value ' + level);
    }

};

const getLogger = (level) => {
    const logger = winston;
    logger.level = level;
    return logger;
};

/**
 * If log level is already defined by build function it returns a valid value. Else it returns a default value, eg when
 * the build function is not already called.
 * @returns {*|string}
 */
const getLevel = () => {
    return level || DEFAULT_LEVEL;
};

exports = module.exports = {
    build: build,
    get: () => {
        return getLogger(getLevel());
    }
};

//TODO ridefinire il logger in modo che scriva in automaico il nome del modulo e della funzione