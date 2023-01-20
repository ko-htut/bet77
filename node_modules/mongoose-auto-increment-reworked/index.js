"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const debug = require("debug");
const mongoose_1 = require("mongoose");
const typescript_lazy_get_decorator_1 = require("typescript-lazy-get-decorator");
/** Default options */
let defaultOptions = {
    field: '_id',
    incrementBy: 1,
    nextCount: '_nextCount',
    resetCount: '_resetCount',
    startAt: 1,
    unique: true
};
/** Debug logger */
const log = debug('mongoose-auto-increment-reworked');
/** Map containing ready states */
const readyMap = new WeakMap();
/** Mongoose plugin for automatically generating auto-incrementing IDs */
class MongooseAutoIncrementID {
    /**
     * Create a new plugin instance
     * @param schema Schema to apply the plugin to. Must be an instance of Mongoose Schema
     * @param modelName Name of the model that this schema will use.
     * @param options Plugin configuration
     * @throws {TypeError} If schema is not given or is not an instance of Mongoose Schema
     * @throws {TypeError} If modelName is not given or is not a string
     */
    constructor(schema, modelName, options = {}) {
        debug('Constructing');
        if (!schema || !(schema instanceof mongoose_1.Schema)) {
            throw new TypeError('Schema is required and must be an instance of Mongoose Schema');
        }
        if (!modelName || typeof modelName !== 'string') {
            throw new TypeError('Model name must be a string');
        }
        debug(`Model name set to ${modelName}`);
        this.model = modelName;
        this.schema = schema;
        this._options = options;
    }
    /** The model instance */
    static get idCounter() {
        log('Creating schema');
        /** Schema definition */
        const idCounterSchema = new mongoose_1.Schema({
            c: {
                default: 0,
                required: true,
                type: Number
            },
            f: {
                required: true,
                type: String
            },
            m: {
                required: true,
                type: String
            },
        }, {
            autoIndex: true,
            id: false,
            skipVersioning: true,
            timestamps: false,
            versionKey: false,
        });
        log('Defining index');
        idCounterSchema.index({ f: 1, m: 1 }, { unique: true });
        log('Creating model instance');
        return mongoose_1.model(MongooseAutoIncrementID.modelName, idCounterSchema);
    }
    /** Error, if any, thrown by applyPlugin() */
    get error() {
        return this.state.error;
    }
    /** Whether or not the initialisation has completed */
    get isReady() {
        return !!this.state.ready;
    }
    /** Promise returned by applyPlugin() */
    get promise() {
        return this.state.promise;
    }
    /** Default arguments for querying the id counter collection */
    get findArgs() {
        const out = {
            f: this.options.field,
            m: this.model
        };
        log('findArgs field defined as %s, model as %s', out.f, out.m);
        return Object.freeze(out);
    }
    /** The initial counter value */
    get initialStart() {
        const ret = this.options.startAt - this.options.incrementBy;
        log('initialStart defined as %s', ret);
        return ret;
    }
    /** User-supplied options merged with defaults */
    get options() {
        const value = MongooseAutoIncrementID.getDefaults();
        Object.assign(value, this._options);
        value.unique = !!value.unique;
        for (const field of Object.keys(value)) {
            log('%s option defined as %s', field, value[field]);
        }
        return Object.freeze(value);
    }
    /** The plugin instante's ready state */
    get state() {
        let states = readyMap.get(this.schema);
        if (!states) {
            states = {};
            readyMap.set(this.schema, states);
        }
        let state = states[this.model];
        // istanbul ignore else
        if (!state) {
            state = {};
            states[this.model] = state;
        }
        return state;
    }
    /** The default options used by the plugin */
    static getDefaults() {
        return Object.assign({}, defaultOptions);
    }
    /**
     * Get the initialisation error for the given schema and model
     * @param schema The schema
     * @param modelName The mode
     * @returns The initialisation error that occurred or undefined if the schema/model combination hasn't been plugged
     *   into yet or hasn't errored.
     */
    static getErrorFor(schema, modelName) {
        const state = MongooseAutoIncrementID.getStateFor(schema, modelName);
        if (state) {
            return state.error;
        }
    }
    /**
     * Get the initialisation promise for the given schema and model
     * @param schema The schema
     * @param modelName The mode
     * @returns The initialisation promise or undefined if the schema/model combination hasn't been plugged into yet.
     */
    static getPromiseFor(schema, modelName) {
        const state = MongooseAutoIncrementID.getStateFor(schema, modelName);
        if (state) {
            return state.promise;
        }
    }
    /**
     * Set the model name this plugin will use. Has no effect if you have already applied the plugin to a schema.
     * @param modelName Name of the plugin model
     * @throws {TypeError} If model name is not a string. Won't happen if you omit the parameter.
     */
    static initialise(modelName) {
        log('Performing static initialisation with name %s', modelName);
        if (modelName !== undefined) {
            if (typeof modelName !== 'string') {
                throw new TypeError('Model name must be a string');
            }
            MongooseAutoIncrementID.modelName = modelName;
        }
        // Perform no-op initialisation
        ((m) => m)(MongooseAutoIncrementID.idCounter);
    }
    /**
     * Check if the given schema and model have finished their plugin initialisation
     * @param schema The schema
     * @param modelName The mode
     * @returns true if the initialisation completed successfully, false if it hasn't completed yet, it errored or hasn't
     *   started yet.
     */
    static isReady(schema, modelName) {
        const state = MongooseAutoIncrementID.getStateFor(schema, modelName);
        if (state) {
            return !!state.ready;
        }
        return false;
    }
    /**
     * Handler for applying the plugin via schema.plugin()
     * @param schema The schema we're applying the plugin to
     * @param options Plugin options. This should be a {@link SchemaPluginOptions} object containing a modelName key and,
     * optionally, any of the other plugin options.
     */
    static plugin(schema, options) {
        if (!options) {
            throw new Error('Options are required');
        }
        const modelName = options.modelName;
        if (!modelName) {
            throw new Error('Options must contain a "modelName" key');
        }
        return new MongooseAutoIncrementID(schema, modelName, options).applyPlugin();
    }
    /**
     * Set default options used by the plugin
     * @param newOpts The options
     * @throws If any parameter is invalid
     */
    static setDefaults(newOpts = {}) {
        const out = Object.assign(MongooseAutoIncrementID.getDefaults(), newOpts);
        MongooseAutoIncrementID.validateOptions(out);
        defaultOptions = out;
    }
    /**
     * Internal static state getter
     * @param schema Schema we're getting the state for
     * @param modelName Model we're getting the state for
     * @returns The ready state or undefined if the state cannot be found
     */
    static getStateFor(schema, modelName) {
        const states = readyMap.get(schema);
        if (states) {
            return states[modelName];
        }
    }
    /**
     * Validates the options supplied by the user
     * @param options The options to validate
     * @throws {TypeError} if a validation fails
     */
    static validateOptions(options) {
        log('Validating options');
        if (!options) {
            throw new TypeError('Options missing');
        }
        log('Validating field');
        if (typeof options.field !== 'string') {
            throw new TypeError('field must be a string');
        }
        log('Validating incrementBy');
        if (typeof options.incrementBy !== 'number') {
            throw new TypeError('incrementBy must be a number');
        }
        log('Validating nextCount');
        if (typeof options.nextCount !== 'string' && options.nextCount !== false) {
            throw new TypeError('nextCount must be a string or false');
        }
        log('Validating resetCount');
        if (typeof options.resetCount !== 'string' && options.resetCount !== false) {
            throw new TypeError('resetCount must be a string or false');
        }
        log('Validating startAt');
        if (typeof options.startAt !== 'number') {
            throw new TypeError('startAt must be a number');
        }
    }
    /**
     * Apply the plugin to the given schema
     * @returns A void promise that resolves when the initialisation has completed. You do not need to wait for the
     *   promise to resolve - any document insertion queries will be queued until the initialisation completes. You
     *   should, however, catch any errors if this promise rejects.
     */
    applyPlugin() {
        log('Running plugin initialisation on %s', this.model);
        try {
            this.validateOptions();
            this.addFieldToSchema();
            this.addNextCount();
            this.addResetCount();
            this.addPreSave();
            this.state.promise = this.init()
                .catch((e) => {
                this.state.error = e;
                throw e;
            });
            return this.state.promise;
        }
        catch (e) {
            this.state.error = e;
            this.state.promise = Promise.reject(this.state.error);
            return this.state.promise;
        }
    }
    /**
     * Validates the options supplied by the user
     * @throws {TypeError} if a validation fails
     */
    validateOptions() {
        MongooseAutoIncrementID.validateOptions(this.options);
    }
    /** Add the field containing our auto-incremented ID to the schema definition */
    addFieldToSchema() {
        const fieldDef = {
            required: false,
            type: Number
        };
        if (this.options.field !== '_id') {
            fieldDef.unique = this.options.unique;
        }
        log('Field defined as %s', JSON.stringify(fieldDef));
        log('Adding field to %s schema', this.model);
        this.schema.add({ [this.options.field]: fieldDef });
    }
    /** Add the next count function if enabled */
    addNextCount() {
        if (this.options.nextCount) {
            log('Adding %s instance and static methods for %s', this.options.nextCount, this.model);
            const fn = () => {
                const exec = MongooseAutoIncrementID.idCounter.findOne(this.findArgs, { c: 1 }).lean().exec();
                return exec
                    .then((doc) => {
                    return doc === null ? this.options.startAt : doc.c + this.options.incrementBy;
                });
            };
            this.schema.static(this.options.nextCount, fn);
            this.schema.method(this.options.nextCount, fn);
        }
        else {
            log('Skipping nextCount methods for %s', this.model);
        }
    }
    /** Add the pre-save hook to the schema that will generate our IDs */
    addPreSave() {
        // tslint:disable-next-line:no-this-assignment
        const self = this;
        log('Adding pre-save hook');
        this.schema.pre('save', function (next) {
            debug('Doc save hook triggered');
            // Only work with new documents
            if (this.isNew) {
                log('Document is new');
                // Plugin might not be ready yet. Define a save function
                const save = () => {
                    if (self.isReady) {
                        log('Plugin ready. Performing onSave logic.');
                        // The payload contains a numeric value on the field. Update the ID counter collection if necessary.
                        if (typeof this[self.options.field] === 'number') {
                            log('%s is a number: %d', self.options.field, self.options.field);
                            self.onSaveNumberField(this[self.options.field])
                                .then(() => next())
                                .catch(next);
                        }
                        else {
                            log('%s is not a number: %s', self.options.field, JSON.stringify(this[self.options.field]));
                            // Fiels does not contain an ID or is NaN. Generate the next value and set it on the payload.
                            self.onSaveAnyField()
                                .then((newCount) => {
                                this[self.options.field] = newCount;
                                next();
                            })
                                .catch(next);
                        }
                    }
                    else if (!self.error) {
                        log('Plugin not ready yet; waiting for %d ms before retrying', 5 /* RETRY_TIMEOUT */);
                        setTimeout(save, 5 /* RETRY_TIMEOUT */);
                    }
                    else {
                        log('Failing; plugin initialisation rejected.');
                        setImmediate(next, new Error('The initialisation promise rejected'));
                    }
                };
                // Immediately call the save function
                setImmediate(save);
            }
            else {
                log('Document is not new; skipping.');
                setImmediate(next);
            }
        });
    }
    /** Add the reset count function if enabled */
    addResetCount() {
        if (this.options.resetCount) {
            log('Adding %s instance and static methods for %s', this.options.resetCount, this.model);
            const fn = () => {
                return MongooseAutoIncrementID.idCounter
                    .findOneAndUpdate(this.findArgs, { c: this.initialStart }, { new: true, upsert: true, fields: { _id: 1 } })
                    .lean()
                    .then(() => this.options.startAt);
            };
            this.schema.static(this.options.resetCount, fn);
            this.schema.method(this.options.resetCount, fn);
        }
        else {
            log('Skipping resetCount methods for %s', this.model);
        }
    }
    /** Initialise the counter for this schema */
    init() {
        log('Performing plugin initialisation');
        return MongooseAutoIncrementID.idCounter.findOne(this.findArgs, { _id: 1 })
            .lean()
            .then((doc) => {
            if (!doc) {
                const payload = {
                    c: this.initialStart,
                    f: this.options.field,
                    m: this.model
                };
                log('No counter document found for %s; creating with %s', this.model, JSON.stringify(payload));
                return MongooseAutoIncrementID.idCounter.create(payload)
                    .then(() => {
                    log('Counter document for %s created', this.model);
                    this.state.ready = true;
                });
            }
            else {
                // All good
                this.state.ready = true;
            }
        });
    }
    /** Generate the next ID, update counter document, return ID */
    onSaveAnyField() {
        return MongooseAutoIncrementID.idCounter
            .findOneAndUpdate(this.findArgs, { $inc: { c: this.options.incrementBy } }, { new: true, setDefaultsOnInsert: true, upsert: true, fields: { c: 1 } })
            .lean()
            .exec()
            .then((doc) => doc.c);
    }
    /** Synchronise the ID provided in the document with the database value */
    onSaveNumberField(value) {
        return MongooseAutoIncrementID.idCounter
            .findOneAndUpdate({ f: this.options.field, m: this.model, c: { $lt: value } }, { c: value }, { new: true, fields: { _id: 1 } })
            .lean()
            .exec();
    }
}
/** Name of the model used by the plugin */
MongooseAutoIncrementID.modelName = 'IdCounter';
tslib_1.__decorate([
    typescript_lazy_get_decorator_1.LazyGetter()
], MongooseAutoIncrementID.prototype, "findArgs", null);
tslib_1.__decorate([
    typescript_lazy_get_decorator_1.LazyGetter()
], MongooseAutoIncrementID.prototype, "initialStart", null);
tslib_1.__decorate([
    typescript_lazy_get_decorator_1.LazyGetter()
], MongooseAutoIncrementID.prototype, "options", null);
tslib_1.__decorate([
    typescript_lazy_get_decorator_1.LazyGetter()
], MongooseAutoIncrementID.prototype, "state", null);
tslib_1.__decorate([
    typescript_lazy_get_decorator_1.LazyGetter()
], MongooseAutoIncrementID, "idCounter", null);
exports.MongooseAutoIncrementID = MongooseAutoIncrementID;
